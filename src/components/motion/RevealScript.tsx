/**
 * Scroll reveals without waiting for React.
 *
 * Elements opt in with data-reveal (optionally style="--reveal-delay: 120"). This
 * inline script runs as soon as the body has been parsed, so content in the first
 * viewport starts its entrance animation immediately instead of staying hidden
 * until the JavaScript bundle has downloaded and hydrated. A MutationObserver picks
 * up elements added by client-side navigations. Without IntersectionObserver or with
 * reduced motion everything is revealed at once.
 *
 * The script marks elements with a data-revealed attribute (the CSS keys off it). Because
 * that can happen before hydration, every data-reveal element carries
 * suppressHydrationWarning so React does not report the extra attribute.
 */
const script = `(function(){var d=document,q='[data-reveal]:not([data-revealed])';
function show(e){e.setAttribute('data-revealed','')}
function watch(fn){new MutationObserver(fn).observe(d.body,{childList:true,subtree:true})}
if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){var all=function(){d.querySelectorAll(q).forEach(show)};all();watch(all);return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0.12});
var seen=new WeakSet();function scan(){d.querySelectorAll(q).forEach(function(e){if(!seen.has(e)){seen.add(e);io.observe(e)}})}
scan();watch(scan)})();`;

export function RevealScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
