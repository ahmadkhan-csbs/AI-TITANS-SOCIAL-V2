export function loadSidebar(activePage){

const sidebar = `
<aside class="sidebar">

<div class="logo">
<h2>🚀 AI TITANS</h2>
</div>

<ul class="menu">

<li class="${activePage==="dashboard"?"active":""}"
onclick="location.href='dashboard.html'">

<i class="fa-solid fa-house"></i>
<span>Dashboard</span>

</li>

<li class="${activePage==="content"?"active":""}"
onclick="location.href='ai-content.html'">

<i class="fa-solid fa-wand-magic-sparkles"></i>
<span>AI Content</span>

</li>

<li class="${activePage==="scheduler"?"active":""}"
onclick="location.href='scheduler.html'">

<i class="fa-solid fa-calendar-days"></i>
<span>Scheduler</span>

</li>

<li class="${activePage==="analytics"?"active":""}"
onclick="location.href='analytics.html'">

<i class="fa-solid fa-chart-line"></i>
<span>Analytics</span>

</li>

<li class="unavailable" aria-disabled="true" title="Coming soon">

<i class="fa-solid fa-comments"></i>
<span>Inbox</span>

</li>

<li class="unavailable" aria-disabled="true" title="Coming soon">

<i class="fa-solid fa-gear"></i>
<span>Settings</span>

</li>

<li id="logoutBtn">

<i class="fa-solid fa-right-from-bracket"></i>
<span>Logout</span>

</li>

</ul>

</aside>
`;

document.getElementById("sidebar").innerHTML = sidebar;

}
