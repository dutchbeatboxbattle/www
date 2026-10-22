import {test, expect, type Page} from '@playwright/test';
import source from '../src/data/cms-store.json';

test.beforeEach(async ({page}) => { await page.route('https://www.youtube.com/**', route => route.fulfill({body:'',contentType:'text/html'})); });

test('language toggles every content section and survives reload, mobile menu works', async ({page}) => {
  await page.goto(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/`);
  await page.getByRole('button',{name:'Switch to English'}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.getByText('The official Dutch Human Beatbox Championship',{exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'DBB Projects'})).toBeVisible();
  await expect(page.getByText('Follow every milestone on the road to the next major DBB event.')).toBeVisible();
  await expect(page.getByText('Get in Touch',{exact:true})).toBeVisible();
  await expect(page.getByText(source.projects[0].descriptionEn).first()).toBeAttached();
  await expect.poll(() => page.locator('img').evaluateAll(images => images.every(img => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0))).toBeTruthy();
  await page.screenshot({path:'test-results/desktop-en.png'});
  await page.reload();
  await expect(page.getByRole('button',{name:'Schakel naar Nederlands'})).toBeVisible();
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Open menu'}).click();
  await expect(page.getByRole('link',{name:'About Us',exact:true}).first()).toBeVisible();
  await page.getByRole('button',{name:'Schakel naar Nederlands'}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','nl');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.getByRole('button',{name:'Menu sluiten'}).click();
  await page.screenshot({path:'test-results/mobile-nl.png'});
});

async function mockGitHub(page: Page, conflict=false) {
  const calls: {route:string; body:any}[]=[];
  let reads=0;
  await page.route('https://api.github.com/repos/test/dbb/**', async route=>{
    const req=route.request(), path=new URL(req.url()).pathname.split('/test/dbb/')[1];
    const body=req.postDataJSON();
    if(req.method()!=='GET') calls.push({route:path,body});
    let result: unknown={};
    if(path.startsWith('git/ref/heads/'))result={object:{sha: conflict && reads++>0 ? 'changed-head' : 'head'}};
    else if(path.startsWith('contents/'))result={content:Buffer.from(JSON.stringify(source)).toString('base64')};
    else if(path==='git/commits/head')result={tree:{sha:'base-tree'}};
    else if(path==='git/trees')result={sha:'new-tree'};
    else if(path==='git/blobs')result={sha:'image-blob'};
    else if(path==='git/commits')result={sha:'new-head'};
    await route.fulfill({json:result});
  });
  await page.goto(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/admin/`);
  await page.getByLabel('GitHub repository').fill('test/dbb');
  await page.getByLabel('Branch',{exact:true}).fill('main');
  await page.locator('input[type=password]').fill('test-token-not-real');
  await page.getByRole('button',{name:'Inloggen op Dashboard'}).click();
  await expect(page.getByText('DBB Admin Dashboard')).toBeVisible();
  return calls;
}

test('admin publishes URL, English text and uploaded image together without storing the token',async({page})=>{
  const calls=await mockGitHub(page);
  await page.getByRole('button',{name:'Bewerken',exact:true}).first().click();
  await page.getByLabel('Project link / URL',{exact:true}).fill('https://example.org/changed');
  await expect(page.getByRole('textbox',{name:'Titel (EN)',exact:true})).toHaveCount(2);
  await page.getByRole('textbox',{name:'Titel (EN)',exact:true}).last().fill('Championship edited');
  await expect(page.getByRole('textbox',{name:'Titel (EN)',exact:true}).last()).toHaveValue('Championship edited');
  await page.getByRole('textbox',{name:'Beschrijving (EN)',exact:true}).last().fill('A new English description.');
  await page.locator('input[type=file]').last().setInputFiles('public/projects/01.webp');
  await expect(page.getByText('Afbeelding verkleinen…')).toHaveCount(0);
  await page.getByRole('button',{name:'Opslaan',exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:'Project wijzigingen opgeslagen!'})).toBeVisible();
  const tree=calls.find(c=>c.route==='git/trees')!.body;
  const saved=JSON.parse(tree.tree.find((entry:any)=>entry.path==='src/data/cms-store.json').content);
  expect(saved.projects[0].link).toBe('https://example.org/changed');
  expect(saved.projects[0].titleEn).toBe('Championship edited');
  expect(saved.projects[0].descriptionEn).toBe('A new English description.');
  expect(saved.projects[0].image).toMatch(/^\/uploads\/.+\.webp$/);
  expect(tree.tree.some((entry:any)=>entry.path==='public'+saved.projects[0].image)).toBeTruthy();
  expect(calls.filter(c=>c.route.startsWith('git/refs/'))).toHaveLength(1);
  expect(calls.find(c=>c.route.startsWith('git/refs/'))!.body.force).toBe(false);
  expect(await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}))).not.toContain('test-token');
  await page.getByRole('button',{name:'Uitloggen'}).click();
  await expect(page.getByRole('button',{name:'Inloggen op Dashboard'})).toBeVisible();
});

test('unsafe URLs and concurrent edits do not discard input or publish',async({page})=>{
  const calls=await mockGitHub(page,true);
  await page.getByRole('button',{name:'Bewerken',exact:true}).first().click();
  const link=page.getByLabel('Project link / URL',{exact:true});
  await link.fill('javascript:alert(1)');
  await page.getByRole('button',{name:'Opslaan',exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:'Ongeldige projectlink'})).toBeVisible();
  await expect(link).toHaveValue('javascript:alert(1)');
  await link.fill('https://example.org/valid');
  await page.getByRole('button',{name:'Opslaan',exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:'repository is intussen gewijzigd'})).toBeVisible();
  await expect(link).toHaveValue('https://example.org/valid');
  expect(calls).toHaveLength(0);
});
