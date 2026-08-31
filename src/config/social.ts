export const social = {
  github: "https://github.com/gauti-labs",
  linkedin: "https://www.linkedin.com/in/gautam-goyal-8b0712154/",
  email: "gautamgoyal1996@gmail.com",
} as const;

export const socialLinks = [
  { label: "GitHub", href: social.github, handle: "gauti-labs" },
  { label: "LinkedIn", href: social.linkedin, handle: "gautam-goyal" },
  { label: "Email", href: `mailto:${social.email}`, handle: social.email },
] as const;
