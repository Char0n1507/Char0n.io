import './style.css'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

async function loadAdvisory() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const contentDiv = document.getElementById('advisory-content');
    const loadingDiv = document.getElementById('advisory-loading');
    const errorDiv = document.getElementById('advisory-error');

    if (!id) {
        loadingDiv.style.display = 'none';
        errorDiv.style.display = 'block';
        return;
    }

    try {
        // Fetch the markdown file from the public folder
        const response = await fetch(`./advisories/${id}.md`);
        
        if (!response.ok) {
            throw new Error('Advisory not found');
        }

        const markdownText = await response.text();
        
        // Parse Markdown to HTML
        const rawHtml = marked.parse(markdownText);
        
        // Sanitize the HTML
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        
        // Hide loading and show content
        loadingDiv.style.display = 'none';
        contentDiv.innerHTML = cleanHtml;
        contentDiv.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading advisory:', error);
        loadingDiv.style.display = 'none';
        
        const errorTitle = document.getElementById('error-title');
        const errorMessage = document.getElementById('error-message');
        const errorIcon = document.getElementById('error-icon');
        
        const isCve = id && (id.includes('cve') || id.includes('audit') || id.includes('takeover') || id.includes('picpeak'));
        
        if (isCve) {
            errorTitle.innerText = "ADVISORY EMBARGOED";
            errorIcon.className = "fas fa-user-secret";
            errorMessage.innerHTML = `This vulnerability advisory is currently under <span style="color: #ff2d55; font-weight: 600;">EMBARGO</span> or being drafted.<br>In accordance with responsible disclosure policies, the full technical details will be published here automatically once the embargo expires or the patch is fully verified.`;
        } else {
            errorTitle.innerText = "ACCESS DENIED";
            errorIcon.className = "fas fa-lock";
            errorMessage.innerHTML = `This machine is currently <span style="color: #ff2d55; font-weight: 600;">ACTIVE</span> on Hack The Box.<br>In accordance with HTB rules, the write-up will be published here automatically once the machine is officially retired.`;
        }
        
        errorDiv.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', loadAdvisory);
