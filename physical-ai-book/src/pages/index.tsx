import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.9, fontSize: '1.1rem' }}>
          By <span style={{ fontWeight: 'bold', color: 'var(--ifm-color-primary-lightest)' }}>Saad Amjad</span>
        </div>
        <div className={styles.buttons} style={{ marginTop: '2rem' }}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Start Reading the Textbook 📚
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Welcome"
      description="Physical AI & Humanoid Robotics Textbook">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h2>Open-Source Curriculum for the Next Generation of Robotics</h2>
            <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
              Master ROS 2, Simulation, NVIDIA Isaac, and Vision-Language-Action models through a hands-on, AI-native learning journey.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
