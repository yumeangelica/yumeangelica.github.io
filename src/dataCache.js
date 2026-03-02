/**
 * Shared data cache — fetches data.json once and serves
 * the same promise to every caller (PageHome, PageProjects, etc.).
 */
let cached = null;

export function fetchData() {
  if (!cached) {
    cached = fetch('/data.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .catch(error => {
        cached = null; // Allow retry on failure
        throw error;
      });
  }
  return cached;
}
