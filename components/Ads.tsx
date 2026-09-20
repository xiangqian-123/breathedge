/**
 * 广告位组件（2026-09-20 接入）。
 *
 * 用原生 <script> 直接渲染而非 next/script：静态导出的 HTML 里脚本按原位顺序执行，
 * 广告网络的 invoke.js 依赖 document.currentScript 在脚本位置注入 iframe，
 * next/script 的运行时注入策略会破坏这个定位逻辑。
 *
 * - PopunderAd：代码1（profitableratecpm 弹出网络），全站放 layout。
 * - ArticleBannerAd：代码2（highrevenueformat 728×90 横幅），放攻略文章页正文底部。
 */

export function PopunderAd() {
  return (
    <>
      <script
        async
        data-cfasync="false"
        src="https://pl31411305.profitableratecpmnetwork.com/a1928557bba01cea323e5b70a6919e35/invoke.js"
      />
      <div id="container-a1928557bba01cea323e5b70a6919e35"></div>
    </>
  );
}

export function ArticleBannerAd() {
  return (
    <div className="ad-slot">
      <script
        dangerouslySetInnerHTML={{
          __html:
            "atOptions = {\n" +
            "  'key' : '2270fa7338442956c4adac8ceb2a2f61',\n" +
            "  'format' : 'iframe',\n" +
            "  'height' : 90,\n" +
            "  'width' : 728,\n" +
            "  'params' : {}\n" +
            "};",
        }}
      />
      <script src="https://www.highrevenueformat.com/2270fa7338442956c4adac8ceb2a2f61/invoke.js" />
    </div>
  );
}
