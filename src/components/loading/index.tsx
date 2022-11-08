import css from "./style.module.css"
export default function Loading(props: any) {
    return (
        <div className={css.loading}>
            <div className={css.loading_content}>
                <div className={css.loading_content_text}>Loading...</div>
                <div className={css.loading_content_spinner}>
                    <div className={css.loading_content_spinner_circle}></div>
                </div>
            </div>
        </div>
    )
}