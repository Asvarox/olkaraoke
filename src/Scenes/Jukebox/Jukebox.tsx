import { Button } from 'Elements/Button';
import VideoPlayer, { VideoState } from 'Elements/VideoPlayer';
import { navigate } from 'hooks/useHashLocation';
import useKeyboardNav from 'hooks/useKeyboardNav';
import { SongPreview } from 'interfaces';
import { shuffle } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Link } from 'wouter';
import useViewportSize from '../../hooks/useViewportSize';
import SongPage from '../Game/SongPage';

interface Props {}

function Jukebox(props: Props) {
    const { width, height } = useViewportSize();
    const [currentlyPlaying, setCurrentlyPlaying] = useState(0);
    const songList = useQuery<SongPreview[]>('songList', () =>
        fetch('./songs/index.json').then((response) => response.json()),
    );

    const [shuffledList, setShuffledList] = useState<SongPreview[]>([]);
    const { register } = useKeyboardNav({ onBackspace: () => navigate('/') });

    useEffect(() => songList.data && setShuffledList(shuffle(songList.data)), [songList.data]);

    const playNext = () => songList.data && setCurrentlyPlaying((current) => (current + 1) % songList.data.length);

    if (!shuffledList.length || !width || !height) return null;

    const navigateUrl = `/game/${encodeURIComponent(shuffledList[currentlyPlaying].file)}`;

    return (
        <SongPage
            width={width}
            height={height}
            songData={shuffledList[currentlyPlaying]}
            data-test="jukebox-container"
            data-song={shuffledList[currentlyPlaying].file}
            background={
                <VideoPlayer
                    autoplay
                    controls
                    width={width}
                    height={height}
                    volume={shuffledList[currentlyPlaying]?.volume}
                    video={shuffledList[currentlyPlaying].video}
                    startAt={shuffledList[currentlyPlaying].videoGap}
                    onStateChange={(state) => {
                        if (state === VideoState.ENDED) playNext();
                    }}
                />
            }>
            <SkipSongButton {...register('skip', playNext)}>Skip</SkipSongButton>
            <Link to={navigateUrl}>
                <PlayThisSongButton {...register('sing a song', () => navigate(navigateUrl), undefined, true)}>
                    Sing this song
                </PlayThisSongButton>
            </Link>
        </SongPage>
    );
}

const PlayThisSongButton = styled(Button)<{ focused: boolean }>`
    bottom: 70px;
    right: 20px;
    width: 500px;
    position: absolute;
    font-size: 1.9vw;
`;

const SkipSongButton = styled(Button)<{ focused: boolean }>`
    bottom: 150px;
    right: 20px;
    width: 300px;
    position: absolute;
    font-size: 1.9vw;
`;

export default Jukebox;
