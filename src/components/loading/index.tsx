import css from "./style.module.css"
// https://codepen.io/thebabydino/pen/VNgewR
// https://codepen.io/BenjaminH/pen/ZNBEPm
export default function Loading(props: any) {
    return (
        <div className={css.loading_wrapper}>
            <div className={css.pswp__preloader__icn}>
                <div className={css.pswp__preloader__cut}>
                    <div className={css.pswp__preloader__donut}></div>
                </div>
            </div>
        </div>
    )
}
