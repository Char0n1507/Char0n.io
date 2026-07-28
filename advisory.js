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
        errorDiv.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', loadAdvisory);
