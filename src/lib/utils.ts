import { Article, Category } from './types';

export function formatAlbanianDate(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
    'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor',
  ];
  const days = ['E Diel', 'E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' });
}

export function getRelatedArticles(articles: Article[], current: Article, count = 4): Article[] {
  return articles
    .filter((a) => a.id !== current.id && a.category === current.category)
    .slice(0, count);
}

export function getArticlesByCategory(articles: Article[], category: Category): Article[] {
  return articles.filter((a) => a.category === category);
}

export function searchArticles(articles: Article[], query: string): Article[] {
  const q = query.toLowerCase();
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} minuta më parë`;
  if (diffHours < 24) return `${diffHours} orë më parë`;
  return `${diffDays} ditë më parë`;
}
