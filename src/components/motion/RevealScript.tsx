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
 *
 * Timing: an element starts its entrance once its top edge has scrolled about a fifth
 * of the way up the screen (rootMargin -18% at the bottom), so the motion happens where
 * the eye is, not while the element is still a sliver at the bottom edge. Near the end
 * of the page, where the last elements may never reach that line, everything already on
 * screen is revealed as soon as the user hits the bottom.
 *
 * Numbers marked data-count (StatsBand) count up from 0 to their rendered value when
 * their block is revealed (same text node, so React and crawlers keep the real value).
 */
const script = `(function(){var d=document,q='[data-reveal]:not([data-revealed])';
function show(e){e.setAttribute('data-revealed','');e.querySelectorAll('[data-count]').forEach(function(n){count(n,parseFloat(getComputedStyle(e).getPropertyValue('--reveal-delay'))||0)})}
function count(n,delay){var t=n.firstChild,to=+n.getAttribute('data-count');if(!t||!to||n.__c)return;n.__c=1;t.nodeValue='0';setTimeout(function(){var s=performance.now(),D=1800;(function f(now){var p=Math.min((now-s)/D,1);t.nodeValue=String(Math.round(to*(1-Math.pow(1-p,4))));if(p<1)requestAnimationFrame(f)})(s)},delay+150)}
function watch(fn){new MutationObserver(fn).observe(d.body,{childList:true,subtree:true})}
if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){var all=function(){d.querySelectorAll(q).forEach(function(e){e.setAttribute('data-revealed','')})};all();watch(all);return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target)}})},{rootMargin:'0px 0px -18% 0px',threshold:0});
var seen=new WeakSet();function scan(){d.querySelectorAll(q).forEach(function(e){if(!seen.has(e)){seen.add(e);io.observe(e)}})}
var ticking=0;function bottom(){ticking=0;var h=innerHeight;if(scrollY+h<d.documentElement.scrollHeight-4)return;d.querySelectorAll(q).forEach(function(e){if(e.getBoundingClientRect().top<h){show(e);io.unobserve(e)}})}
addEventListener('scroll',function(){if(!ticking){ticking=1;requestAnimationFrame(bottom)}},{passive:true});
scan();watch(scan)})();`;

export function RevealScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
