import React, {MouseEvent, useRef, useState} from 'react';
import loadable from '@loadable/component';
import dayjs from 'dayjs';

import RefreshButton from 'component/RefreshButton';
import ChartLayout from 'component/ChartLayout';
import {
    CategoryScale,
    Chart,
    ChartOptions,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import {getElementAtEvent, Line} from 'react-chartjs-2';

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
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

type ReactionDataset = {
    fill: boolean,
    label: string,
    data: Array<number>,
    borderColor: string,
    backgroundColor: string,
    borderWidth: number,
    pointRadius: number,
    pointHoverRadius: number
}

const LIMIT_POSTS_DISPLAYED = 10;
const OPTIONS_CHART: ChartOptions = {
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
 * The When page content
 */
export default function When(): JSX.Element {
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
        const post = recentPosts[index];
        setPost(post);
    }

    // sort posts by date
    const recentPosts: Array<Post> = Object.values(posts)
        .sort((first: Post, second: Post) => second.createdTime - first.createdTime)
        .slice(0, LIMIT_POSTS_DISPLAYED)
        .reverse();

    // map reaction counts to chart data
    const labels: Array<string> = [];
    const reactionTypes = new Set<ReactionType>();
    recentPosts.forEach((post: Post) => {
        labels.push(dayjs.unix(post.createdTime).format('MMM D YYYY'));
        post.reactions.forEach((reaction: PostReaction) => {
            const reactionType: ReactionType = ReactionType.fromType(reaction.type);
            reactionTypes.add(reactionType);
        })
    });
    const datasets: Array<ReactionDataset> = [];
    Array.from(reactionTypes).forEach((reactionType: ReactionType) => {
        const data: Array<number> = [];
        recentPosts.forEach((post: Post) => {
            const reactionCount = post.reactions.find((reaction: PostReaction) => reaction.type === reactionType.type)?.count ?? 0;
            data.push(reactionCount);
        });
        const {borderColor, backgroundColor} = reactionType;
        datasets.push({
            fill: true,
            label: `${reactionType}`,
            data,
            borderColor,
            backgroundColor,
            borderWidth: 1,
            pointRadius: 5,
            pointHoverRadius: 10
        });
    });
    const chartData = {labels, datasets};

    // show a reaction type line chart with reactions for most the recent posts
    return (
        <div className="metadata-when">
            <RefreshButton/>
            Here are when your {LIMIT_POSTS_DISPLAYED} most recent posts were reacted to...
            <ChartTooltip/>
            <ChartLayout>
                <Line
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
