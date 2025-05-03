// This layout can be used for routes within the (auth) group,
// like /profile. It ensures consistent styling or logic for
// authenticated user sections.

// For now, it just renders children, but you could add sidebars,
// specific headers/footers, or auth checks here later.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
