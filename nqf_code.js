/*
 * QQ经典农场 Code 拦截脚本
 * 功能：从请求 URL 中提取 code 参数，推送通知并复制到剪贴板，
 *       同时将请求重定向到 127.0.0.1 阻止 code 被消耗
 */

const url = $request.url;
const codeMatch = url.match(/[?&]code=([^&]*)/);

if (codeMatch && codeMatch[1]) {
    const code = codeMatch[1];

    // 复制 code 到剪贴板（Loon 支持 $clipboard API）
    if (typeof $clipboard !== "undefined") {
        $clipboard.set(code);
    }

    // 推送通知，标题/副标题/正文
    $notification.post(
        "QQ经典农场 Code 已拦截",
        "Code 已自动复制到剪贴板",
        `${code}`
    );

    // 将请求重定向到 127.0.0.1，阻止 code 被服务器消耗
    const newUrl = url.replace(
        /^https?:\/\/gate-obt\.nqf\.qq\.com/,
        "http://127.0.0.1"
    );
    $done({ url: newUrl });
} else {
    // 没有匹配到 code，放行请求
    $done({});
}
