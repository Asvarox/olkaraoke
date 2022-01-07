interface Props {
    score: number;
}

const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })

export default function ScoreText({ score }: Props) {
    return <>{formatter.format(score)}</>
}