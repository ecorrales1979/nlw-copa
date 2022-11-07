import { useNavigation } from '@react-navigation/native';
import { Heading, useToast, VStack } from 'native-base';
import { useState } from 'react';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { api } from '../lib/api';

export function Find() {
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')
  const toast = useToast()
  const { navigate } = useNavigation()

  async function handleJoinPoll() {
    try {
      setIsLoading(true)

      if (!code.trim()) {
        toast.show({
          title: 'Informe o código',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post('/polls/join', { code })

      toast.show({
        title: 'Você entrou no balão com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      })

      navigate('polls')
    } catch (error) {
      console.error(error)

      const message = getErrorMessage(error.response?.data?.message)

      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500'
      })
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Encontre um bolão através de seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Código do bolão"
          autoCapitalize='characters'
          onChangeText={setCode}
          value={code}
        />

        <Button title="BUSCAR BOLÃO" isLoading={isLoading} onPress={handleJoinPoll} />
      </VStack>
    </VStack>
  )
}

function getErrorMessage(message: string) {
  if (message === 'Poll not found') return 'Bolão não encontrado'

  if (message === 'You already joined this poll') return 'Você já está nesse bolão'

  return 'Erro procurando o bolão'
}