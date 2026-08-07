import fs from 'fs';
import path from 'path';

const directory = './src';

const replacements = [
  { search: /bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600/g, replace: 'bg-gradient-to-br from-church-navy to-church-blue' },
  { search: /bg-gradient-to-br from-purple-50 via-white to-pink-50/g, replace: 'bg-slate-50' },
  { search: /bg-gradient-to-br from-white via-purple-50 to-pink-50/g, replace: 'bg-slate-50' },
  { search: /from-purple-500 via-pink-500 to-purple-500/g, replace: 'from-church-blue via-church-lightblue to-church-blue' },
  { search: /from-purple-500 to-pink-500/g, replace: 'from-church-blue to-church-lightblue' },
  { search: /from-purple-600 to-pink-600/g, replace: 'from-church-navy to-church-blue' },
  { search: /from-purple-500 to-indigo-500/g, replace: 'from-church-navy to-church-blue' },
  { search: /from-indigo-500 to-purple-500/g, replace: 'from-church-blue to-church-navy' },
  { search: /from-violet-500 to-purple-500/g, replace: 'from-church-darkpurple to-church-navy' },
  { search: /from-fuchsia-500 to-pink-500/g, replace: 'from-church-blue to-church-lightblue' },
  { search: /from-pink-500 to-rose-500/g, replace: 'from-church-lightblue to-church-blue' },
  { search: /hover:from-purple-700 hover:to-pink-700/g, replace: 'hover:from-church-darkpurple hover:to-church-navy' },
  { search: /bg-purple-300\/20/g, replace: 'bg-church-lightblue/10' },
  { search: /bg-pink-400\/20/g, replace: 'bg-church-blue/5' },
  { search: /bg-pink-300\/20/g, replace: 'bg-church-blue/5' },
  { search: /text-purple-600/g, replace: 'text-church-blue' },
  { search: /text-purple-500/g, replace: 'text-church-blue' },
  { search: /from-purple-100 to-pink-100/g, replace: 'from-blue-50 to-blue-100' },
  { search: /ring-purple-500\/20/g, replace: 'ring-church-blue/20' },
  { search: /focus:border-purple-500/g, replace: 'focus:border-church-blue' },
  { search: /via-purple-500/g, replace: 'via-church-blue' },
  { search: /from-purple-600\/80 to-pink-600\/80/g, replace: 'from-church-navy/80 to-church-blue/80' },
  { search: /from-purple-500 via-purple-600 to-pink-600/g, replace: 'from-church-navy to-church-blue' },
  { search: /bg-church-purple-medium/g, replace: 'bg-church-blue' }
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(directory);
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  replacements.forEach(r => {
    content = content.replace(r.search, r.replace);
  });
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
