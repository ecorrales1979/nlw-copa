import { FormEvent, useState } from 'react'
import Image from 'next/image'

import appPreviewImg from '../assets/nlw-copa-preview.png'
import iconCheckImg from '../assets/icon-check.svg'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import { api } from '../lib/axios'

interface HomeProps {
  guessCount: number
  poolCount: number
  userCount: number
}

export default function Home({ guessCount, poolCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()

    await api.post('/pools', { title: poolTitle }).then(async (response) => {
      const {code} = response.data
      await navigator.clipboard.writeText(code)
      alert('Balão criado com sucesso. O código foi copiado para a área de transferência')
      setPoolTitle('')
    }).catch((error: Error) => {
      console.error(error)
      alert('Falha ao criar o balão, tente novamente!')
    })
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 flex gap-2">
          <input
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            onChange={ev => setPoolTitle(ev.target.value)}
            value={poolTitle}
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-gray-300 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 text-gray-100 flex justify-between">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div>
              <div className="font-bold text-2xl">+{poolCount}</div>
              <div>Bolões criados</div>
            </div>
          </div>
          <div className="w-px min-h-full bg-gray-600" />
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div>
              <div className="font-bold text-2xl">+{guessCount}</div>
              <div>Palpites enviados</div>
            </div>
          </div>
        </div>
      </main>

      <Image src={appPreviewImg} alt="Preview image of mobile app" quality={100} />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get<{ count: number }>('http://localhost:3333/pools/count'),
    api.get<{ count: number }>('http://localhost:3333/guesses/count'),
    api.get<{ count: number }>('http://localhost:3333/users/count'),
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}
