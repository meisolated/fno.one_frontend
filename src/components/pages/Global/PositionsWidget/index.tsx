import { useEffect, useState } from "react"
import badgeCSS from "../../../Badge/style.module.css"
import css from "./styles.module.css"
export default function PositionWidget({ positionsData, marketData }: any) {
    const [totalPointsCaptured, setTotalPointsCaptured] = useState(0)
    const [totalProfitAndLoss, setTotalProfitAndLoss] = useState(0)
    const [positionActions, setPositionActions] = useState<any>({})

    function togglePositionActions(positionId: string) {
        setPositionActions({
            ...positionActions,
            [positionId]: !positionActions[positionId]
        })
    }

    useEffect(() => {
        setTotalPointsCaptured(positionsData.positionMetrics.totalPointsCaptured)
        setTotalProfitAndLoss(positionsData.positionMetrics.totalProfitAndLoss)
    }, [positionsData])

    return (
        <div className={css.positionsWrapper}>
            <div className={css.positionsHeader}>
                <div>SYMBOL</div>
                <div>QUANTITY</div>
                <div>BUY AVG</div>
                <div>SIDE</div>
                <div>STOP LOSS</div>
            </div>

            {positionsData.positions.length > 0 &&
                positionsData.positions.map((position: any, i: any) => {
                    const onGoingProfitAndLossIsTradeIsActive = parseFloat((
                        position.side == 1
                            ? marketData[position.trueDataSymbol]
                                ? marketData[position.trueDataSymbol].lp - position.price
                                : 0
                            : position.price - (marketData[position.trueDataSymbol] ? marketData[position.trueDataSymbol].lp : 0)
                    ).toFixed(2))
                    const ProfitAndLossInPoints: number = position.sellAveragePrice != 0 || position.buyAveragePrice != 0 ? parseFloat((position.side == 1 ? position.sellAveragePrice - position.buyAveragePrice : position.buyAveragePrice - position.sellAveragePrice).toFixed(2)) : onGoingProfitAndLossIsTradeIsActive
                    const ProfitAndLoss: number = parseFloat((ProfitAndLossInPoints * position.quantity).toFixed(2))

                    return (
                        <div key={i} className={css.position} onClick={() => togglePositionActions(position.id)} >
                            <div className={css.positionInfo}>
                                <div>{position.symbol}</div>
                                <div>{position.quantity}</div>
                                <div>{position.price}</div>
                                <div className={`${position.side == 1 ? badgeCSS.buyBadge : badgeCSS.sellBadge}`}>{position.side == 1 ? "BUY" : "SELL"}</div>
                                <div>{position.side == 1 ? (position.price - position.stopLoss).toFixed(2) : (position.price + position.stopLoss).toFixed(2)}</div>
                            </div>
                            <div className={css.positionStatus}>
                                <div className="flex-direction">
                                    <div className={`${ProfitAndLossInPoints < 0 ? css.backgroundRed : css.backgroundGreen}`}>PnL: {ProfitAndLossInPoints} [{ProfitAndLoss}]</div>
                                    <div>&nbsp;|&nbsp;({onGoingProfitAndLossIsTradeIsActive})</div>
                                </div>
                                <div>{position.status == "exitPositionOrderFilled" ? "CLOSED" : position.status}</div>
                            </div>

                            <div className={`${css.positionActions} ${!positionActions[position.id] && css.positionActionsHide}`}>
                                <div className={css.positionAction}>
                                    <div className="material-symbols-rounded">close</div>
                                    Close
                                </div>
                                <div className={css.positionAction}>
                                    <div className="material-symbols-rounded">switch_access_shortcut</div>
                                    Trial StopLoss
                                </div>
                                <div className={css.positionAction}>
                                    Buy Average Price : {position.buyAveragePrice != 0 ? position.buyAveragePrice : 0}
                                    <br />
                                    Sell Average Price : {position.sellAveragePrice != 0 ? position.sellAveragePrice : 0}
                                </div>
                            </div>
                        </div>
                    )
                })}
            <div className={css.positionsFooter}>
                <div className={css.positionsFooterTotalPointsCaptured}>
                    <div>Total Points Captured</div>
                    <div className={`${totalPointsCaptured > 0 ? css.backgroundGreen : css.backgroundRed}`}>{totalPointsCaptured} | {totalProfitAndLoss}</div>
                </div>
            </div>
        </div>
    )
}
