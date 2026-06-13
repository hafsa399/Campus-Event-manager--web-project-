    async function loadNavbar() {
  const response = await fetch("nav.html");
  const navbar = await response.text();
  document.getElementById("navbar").innerHTML = navbar;
}
loadNavbar();



const subscribe=document.getElementById("btnSubscribe");
subscribe.addEventListener("click",function(){
   alert("thanks for subscribing");
});

