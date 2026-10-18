// These transforms belong to scene contents, never to the scroll container or
// the sticky ritual stage. gsap.matchMedia owns teardown for reduced motion.
export function createEditorialMotion({gsap,ScrollTrigger}){
 const context=gsap.matchMedia();
 context.add('(min-width:1px)',()=>{
  gsap.fromTo('.origin-frame',{clipPath:'inset(12% 9% 12% 9%)'},{clipPath:'inset(0% 0% 0% 0%)',ease:'none',scrollTrigger:{trigger:'.origin',start:'top 90%',end:'top 4%',scrub:true}});
  gsap.fromTo('.origin h2',{yPercent:18},{yPercent:-7,ease:'none',scrollTrigger:{trigger:'.origin',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.fromTo('.cafe-gallery',{clipPath:'inset(8% 4% 8% 4%)'},{clipPath:'inset(0% 0% 0% 0%)',ease:'none',scrollTrigger:{trigger:'.cafe-gallery',start:'top 95%',end:'top 25%',scrub:true}});
  gsap.fromTo('.cafe-photo img',{scale:1.2},{scale:1,ease:'none',scrollTrigger:{trigger:'.cafe-gallery',start:'top bottom',end:'bottom top',scrub:true}});
 });
 context.add('(min-width:1001px)',()=>{
  gsap.fromTo('.manifesto h2',{rotationX:9,transformPerspective:1100},{rotationX:-3,ease:'none',scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:true}});
 });
 return{dispose:()=>context.revert()};
}
