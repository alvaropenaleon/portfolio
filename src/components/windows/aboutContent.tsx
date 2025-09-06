import Bio from '@/components/about/bio';
import styles from '@/styles/about/aboutPage.module.css';

type Props = {
  bio: string;
};

export default function AboutContent({ bio }: Props) {
  return (
    <main className={styles.aboutMain}>
      <Bio markdown={bio} />
      <p>Want to say hi? Tap a link below:</p>
      <br />
      <ul>
        <li><a href="mailto:alvleon@hotmail.com">📬 Email me</a></li>
        <li><a href="https://github.com/alvaropenaleon" target="_blank" rel="noopener noreferrer">🐙 GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/alvaropenaleon/" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a></li>
      </ul>
      <br />
      <p>Longer thoughts? See my <a href="https://www.linkedin.com/in/alvaropenaleon/" target="_blank" rel="noopener noreferrer"><b>blog</b></a>.</p>
    </main>
  );
}
