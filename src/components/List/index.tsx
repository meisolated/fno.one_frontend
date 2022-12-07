import css from "./style.module.css"

interface props {
    columns: Array<String>
    rows: Array<Object>
}

export default function List(props: props) {
    const { columns, rows } = props
    return (
        <div className={css.list}>
            <div className={css.listHeader}>
                {columns.map((column: any, index: number) => {
                    return (
                        <div className={css.listHeaderItem} key={index}>
                            {column}
                        </div>
                    )
                })}
            </div>
            <div className={css.listBody}>
                {rows.map((row: any, index: number) => {
                    return (
                        <div className={css.listRow} key={index}>
                            {columns.map((column: any, nIndex: number) => {
                                return (
                                    <div className={css.listRowItem} key={nIndex}>
                                        {row[column]}
                                    </div>
                                )
                            })}
                            <br />
                        </div>
                    )
                })}
            </div>
        </div>
    )

}
