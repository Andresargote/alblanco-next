import {GetStaticProps} from 'next';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import api from '../services/api';
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';

import useReduceContent from '../hooks/useReduceContent';

import styles from '../styles/home.module.scss';

type Article = {
  id: string;
  slug: string;
  autor: string;
  title: string;
  description: string;
  imgURL: string;
}

type HomeProps = {
  articles: Article[];
}

export default function Home({articles}: HomeProps) {

  return (
    <main className={styles.homeContainer}>

      <Head>
        <title>Al blanco | Salud, Economía y Política</title>
        <link rel="icon" href="/favicon.ico" />

        <meta name="description" content="Al blanco es un medio digital que apunta a la veracidad y precisión de sucesos e informaciones de gran interés colectivo. Ya no más tiempo perdido" />

       {/*  <!-- Google / Search Engine Tags --> */}
        <meta itemProp="name" content="Al blanco | Salud, Economía y Política" />
        <meta itemProp="description" content="Al blanco es un medio digital que apunta a la veracidad y precisión de sucesos e informaciones de gran interés colectivo. Ya no más tiempo perdido" />
        <meta itemProp="image" content="/imageAlblanco.jpg" />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://alblan.co" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Al blanco | Salud, Economía y Política" />
        <meta property="og:description" content="Al blanco es un medio digital que apunta a la veracidad y precisión de sucesos e informaciones de gran interés colectivo. Ya no más tiempo perdido" />
        <meta property="og:image" content="/imageAlblanco.jpg" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Al blanco | Salud, Economía y Política" />
        <meta name="twitter:description" content="Al blanco es un medio digital que apunta a la veracidad y precisión de sucesos e informaciones de gran interés colectivo. Ya no más tiempo perdido" />
        <meta name="twitter:image" content="/imageAlblanco.jpg" />
      </Head>

      {
        articles.map(article => {
          return (
            <Link href={`/articles/${article.slug}`} key={article.id}>
              <a>
                <picture>
                  <Image 
                    src={article.imgURL}
                    alt={article.title}
                    width={800}
                    height={600}
                    objectFit='cover'
                  />
                </picture>

                <div>
                  <h2>{article.title}</h2>

                  {
                    unified()
                        .use(parse)
                        .use(remark2react)
                        .processSync(article.description).result
                  }

                  <span>por <strong>{article.autor}</strong></span>
                </div>

              </a>
            </Link>
          )
        })
      }

    </main>
  )
}


export const getStaticProps: GetStaticProps = async () => {

  const {data} = await api.get('articles');

  const articles = data.map(article => {
    return {
      id: article._id,
      slug: article.slug,
      autor: article.autor,
      title: article.title,
      imgURL: article.img[0].formats.small.url,
      description: useReduceContent(article.content)
    }
  }).reverse();//con el reverse logramos q el ultimo seal el primero

  return {
    props: {
      articles
    },
    revalidate: 60 * 60 * 8 //cada 8 horas
  }

};
