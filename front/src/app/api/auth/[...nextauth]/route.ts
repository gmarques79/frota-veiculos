import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null // <- garante que não é undefined
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            senha: credentials.senha,
          }),
        })

        if (!res.ok) return null

        const data = await res.json()
        return {
          id: data.usuario.id,
          nome: data.usuario.nome,
          email: data.usuario.email,
          token: data.access_token,
        }
      },
    }),
  ],
  callbacks: {

    

    async jwt({ token, user }) {
        if (user) {
          const u = user as any // ou tipar corretamente se quiser
          token.accessToken = u.token
        }
        return token
      },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
