import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const metrics = { followers: "18.4K", reach: "124K", engagement: "92%", posts: "245" };
let growthChart;

function createGrowthChart() {
    const canvas = document.getElementById("growthChart");
    if (!canvas || typeof Chart === "undefined") return;
    growthChart?.destroy();
    growthChart = new Chart(canvas, {
        type: "line",
        data: { labels: ["1", "5", "10", "15", "20", "25", "30"], datasets: [{ label: "Followers", data: [1200, 2400, 3500, 6000, 9800, 14200, 18400], borderColor: "#60a5fa", backgroundColor: "rgba(96, 165, 250, 0.18)", fill: true, tension: 0.35 }] },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function downloadCsv() {
    const csv = ["Platform,Followers,Reach,Engagement", "LinkedIn,8400,58000,92%", "Instagram,5800,43000,88%", "Facebook,2900,21000,81%", "X,1200,9000,75%", "Threads,950,6200,79%"].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "analytics-report.csv";
    link.click();
    URL.revokeObjectURL(url);
}

onAuthStateChanged(auth, (user) => {
    if (!user) { window.location.href = "login.html"; return; }
    const welcome = document.querySelector(".welcome-text");
    if (welcome) welcome.textContent = `Welcome back, ${user.displayName || user.email} 👋`;
});

document.getElementById("refreshAnalytics")?.addEventListener("click", () => {
    document.getElementById("followersCount").textContent = metrics.followers;
    document.getElementById("reachCount").textContent = metrics.reach;
    document.getElementById("engagementCount").textContent = metrics.engagement;
    document.getElementById("postCount").textContent = metrics.posts;
    createGrowthChart();
});
document.getElementById("downloadCSV")?.addEventListener("click", downloadCsv);
document.getElementById("downloadPDF")?.addEventListener("click", () => alert("PDF export is coming soon."));
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    if (!window.confirm("Do you want to log out?")) return;
    await signOut(auth);
    window.location.href = "login.html";
});
createGrowthChart();
