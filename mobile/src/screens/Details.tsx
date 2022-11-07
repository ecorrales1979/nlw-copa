import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { HStack, useToast, VStack } from 'native-base';
import { useRoute } from '@react-navigation/native'

import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Option } from '../components/Option';
import { PoolCardPros} from '../components/PoolCard'
import { PoolHeader } from '../components/PoolHeader';
import { api } from '../lib/api';
import { Guesses } from '../components/Guesses';

interface RouteParams {
  id: string
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true)
  const [pollDetails, setPollDetails] = useState({} as PoolCardPros)
  const [selectedOption, setSelectedOption] = useState<'guesses' | 'ranking'>('guesses')
  const toast = useToast()
  const route = useRoute()
  const { id } = route.params as RouteParams

  async function handleCodeShare() {
    await Share.share({
      message: pollDetails.code
    })
  }

  async function fetchPollDetails() {
    try {
      setIsLoading(true)

      const response = await api.get(`/polls/${id}`)

      setPollDetails(response.data.poll)
    } catch (error) {
      console.error(error)

      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPollDetails()
  }, [id])

  if (isLoading) return <Loading />

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={pollDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {pollDetails._count.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={pollDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={selectedOption === 'guesses'}
              onPress={() => setSelectedOption('guesses')}
            />
            <Option
              title="Ranking do grupo"
              isSelected={selectedOption === 'ranking'}
              onPress={() => setSelectedOption('ranking')}
            />
          </HStack>

          <Guesses pollId={pollDetails.id} code={pollDetails.code} />
        </VStack>
      ) : (<EmptyMyPoolList code={pollDetails.code} />)}
    </VStack>
  )
}