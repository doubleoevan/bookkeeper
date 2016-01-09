import React, {MouseEvent, useRef, useState} from 'react';
import loadable from '@loadable/component';

import RefreshButton from 'component/RefreshButton';
import ChartLayout from 'component/ChartLayout';
import {ArcElement, Chart, ChartOptions, Legend, Tooltip} from 'chart.js';
import {Doughnut, getElementAtEvent} from 'react-chartjs-2';

import {Post, PostReaction} from 'service/PlatformService';
import {useAppSelector} from 'app/hooks';
import {selectPosts} from 'app/platformSlice';
import ReactionType from 'type/ReactionType';

const ChartTooltip = loadable(() => import(/* webpackPrefetch: true */ 'component/ChartTooltip'));
const BottomMenu = loadable(() => import(/* webpackPrefetch: true */ 'component/BottomMenu'));
const ReactionPosts = loadable(() => import(/* webpackPrefetch: true */ 'component/ReactionPosts'));

Chart.register(ArcElement, Tooltip, Legend);

type ReactionCountPosts = {
    type: string,
    count: number,
    posts: Array<Post>,
}

type ReactionCountPostsMap = {
    [platformReaction: string]: ReactionCountPosts,
}

type ChartDataset = {
    data: Array<number>,
    tooltips: Array<string>,
    borderColor: Array<string>,
    backgroundColor: Array<string>,
    borderWidth: number
}

const OPTIONS_CHART: ChartOptions = {
    plugins: {
        tooltip: {
            displayColors: false,
            callbacks: {
                title: () => '',
                label: ({dataIndex, dataset}) => {
                    const chartDataset = dataset as ChartDataset;
                    return chartDataset.tooltips[dataIndex];
                }
            }
        }
    },
    maintainAspectRatio: false
}

/**
 * The How page content
 */
export default function How(): JSX.Element {
    const [reactionType, setReactionType] = useState<ReactionType | null>(null);
    const [reactionPosts, setReactionPosts] = useState<Array<Post>>([]);
    const posts: { [platformPostId: string]: Post; } = useAppSelector(selectPosts);
    const chartRef = useRef();

    const onChartClick = (event: MouseEvent<HTMLCanvasElement>) => {
        // set the selected reaction type and posts
        const index = chartRef?.current && getElementAtEvent(chartRef?.current, event)[0]?.index;
        if (typeof index !== 'number') {
            onClosePosts();
            return;
        }
        const reactionType = reactionTypes[index];
        const posts = reactionCountPostsMap[reactionType.type].posts;
        setReactionType(reactionType);
        setReactionPosts(posts);
    }

    const onClosePosts = () => {
        // clear the selected reaction type and posts
        setReactionType(null);
        setReactionPosts([]);
    }

    // sum reaction counts by type and map posts to reaction types
    const reactionCountPostsMap: ReactionCountPostsMap = {};
    Object.values(posts).forEach((post: Post) => {
        const {reactions} = post;
        reactions.forEach((reaction: PostReaction) => {
            const {type, count} = reaction;
            const reactionCountId = `${type}`;
            const reactionCountPosts = reactionCountPostsMap[reactionCountId] || {type, count: 0, posts: []};
            reactionCountPosts.count += count;
            reactionCountPosts.posts.push(post);
            reactionCountPostsMap[reactionCountId] = reactionCountPosts;
        });
    });

    // map reaction counts to chart data
    const data: Array<number> = [];
    const labels: Array<string> = [];
    const tooltips: Array<string> = [];
    const borderColors: Array<string> = [];
    const backgroundColors: Array<string> = [];
    const reactionTypes: Array<ReactionType> = [];
    Object.values(reactionCountPostsMap).forEach((reactionCountPosts: ReactionCountPosts) => {
        const {type, count, posts} = reactionCountPosts;
        const reactionType = ReactionType.fromType(type);
        const {borderColor, backgroundColor} = reactionType;
        data.push(count);
        labels.push(type);
        tooltips.push(`${count} ${type} reactions to your ${posts.length} posts`)
        borderColors.push(borderColor);
        backgroundColors.push(backgroundColor);
        reactionTypes.push(reactionType);
    });
    const datasets: Array<ChartDataset> = [{
        data,
        tooltips,
        borderColor: borderColors,
        backgroundColor: backgroundColors,
        borderWidth: 1
    }];
    const chartData = {labels, datasets};

    // show a reaction type pie chart
    return (
        <div className="metadata-how">
            <RefreshButton/>
            Here are how your most recent posts were reacted to...
            <ChartTooltip/>
            <ChartLayout>
                <Doughnut
                    ref={chartRef}
                    data={chartData}
                    options={OPTIONS_CHART}
                    onClick={onChartClick}
                />
            </ChartLayout>
            {reactionPosts?.length > 0 && reactionType && (
                <BottomMenu isOpen={true} onClose={onClosePosts}>
                    <ReactionPosts reaction={reactionType} posts={reactionPosts}/>
                </BottomMenu>
            )}
        </div>
    );
};
