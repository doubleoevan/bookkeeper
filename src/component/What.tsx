import React, {MouseEvent, useRef, useState} from 'react';
import loadable from '@loadable/component';
import dayjs from 'dayjs';

import RefreshButton from 'component/RefreshButton';
import ChartLayout from 'component/ChartLayout';
import {BarElement, CategoryScale, Chart, ChartOptions, Legend, LinearScale, Title, Tooltip} from 'chart.js';
import {Bar, getElementAtEvent} from 'react-chartjs-2';

import {Post, PostReaction} from 'service/PlatformService';
import ReactionType from 'type/ReactionType';
import {useAppSelector} from 'app/hooks';
import {selectPosts} from 'app/platformSlice';

const ChartTooltip = loadable(() => import(/* webpackPrefetch: true */ 'component/ChartTooltip'));
const BottomMenu = loadable(() => import(/* webpackPrefetch: true */ 'component/BottomMenu'));
const PostReactions = loadable(() => import(/* webpackPrefetch: true */ 'component/PostReactions'));

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

type PostReactionTotal = {
    post: Post,
    reactionTotal: number,
}

type ReactionDataset = {
    label: string,
    data: Array<number>,
    borderColor: string,
    backgroundColor: string,
    borderWidth: number,
}

type ReactionDatasets = {
    [key: string]: ReactionDataset,
}

const LIMIT_POSTS_DISPLAYED = 10;
const OPTIONS_CHART: ChartOptions = {
    scales: {
        x: {stacked: true},
        y: {stacked: true}
    },
    plugins: {
        tooltip: {
            displayColors: false,
            callbacks: {
                title: () => '',
                label: ({formattedValue, dataset, label}) => {
                    return `${formattedValue} ${dataset.label} reactions to your post on ${label}`;
                }
            }
        }
    },
    maintainAspectRatio: false
};

/**
 * The What page content
 */
export default function What(): JSX.Element {
    const [post, setPost] = useState<Post | null>(null);
    const posts: { [platformPostId: string]: Post; } = useAppSelector(selectPosts);
    const chartRef = useRef();

    const onChartClick = (event: MouseEvent<HTMLCanvasElement>) => {
        // set the selected post
        const index = chartRef?.current && getElementAtEvent(chartRef.current, event)[0]?.index;
        if (typeof index !== 'number') {
            setPost(null);
            return;
        }
        const post = postReactionTotals[index].post;
        setPost(post);
    }

    // sort posts by reaction totals
    const postReactionTotals: Array<PostReactionTotal> = Object.values(posts).map((post: Post) => {
        let reactionTotal = 0;
        post.reactions.forEach((reaction: PostReaction) => reactionTotal += reaction.count);
        return {post, reactionTotal}
    })
        .sort((first: PostReactionTotal, second: PostReactionTotal) => second.reactionTotal - first.reactionTotal)
        .slice(0, LIMIT_POSTS_DISPLAYED)
        .reverse();

    // map reaction counts to chart data
    const reactionDatasets: ReactionDatasets = {};
    for (const reactionType of ReactionType) {
        const {borderColor, backgroundColor} = reactionType;
        reactionDatasets[reactionType.type] = {
            label: reactionType.type,
            data: [],
            borderColor,
            backgroundColor,
            borderWidth: 1
        };
    }
    const labels: Array<string> = [];
    postReactionTotals.forEach(({post}: PostReactionTotal) => {
        const label = dayjs.unix(post.createdTime).format('MMM D YYYY');
        labels.push(label);
        for (const reactionType of ReactionType) {
            const reactionCount = post.reactions.find((reaction: PostReaction) => reaction.type === reactionType.type)?.count || 0;
            reactionDatasets[reactionType.type].data.push(reactionCount);
        }
    });
    const datasets = Object.values(reactionDatasets)
        .filter((reactionDataset: ReactionDataset) => reactionDataset.data.reduce((first: number, second: number) => first + second, 0) > 0);
    const chartData = {labels, datasets};

    // show a reaction type bar chart for the posts with most reactions
    return (
        <div className="metadata-what">
            <RefreshButton/>
            Here are your {LIMIT_POSTS_DISPLAYED} most reacted to recent posts...
            <ChartTooltip/>
            <ChartLayout>
                <Bar
                    ref={chartRef}
                    data={chartData}
                    options={OPTIONS_CHART}
                    onClick={onChartClick}
                />
            </ChartLayout>
            {post && (
                <BottomMenu isOpen={true} onClose={() => setPost(null)}>
                    <PostReactions post={post}/>
                </BottomMenu>
            )}
        </div>
    );
};
