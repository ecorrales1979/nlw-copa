import { IInputProps, Input as InputNB } from 'native-base';

export function Input({ ...rest }: IInputProps) {
  return (
    <InputNB
      bg="gray.800"
      h={14}
      px={4}
      borderColor="gray.600"
      fontSize="md"
      fontFamily="body"
      color="white"
      placeholderTextColor="gray.300"
      _focus={{
        bg: "gray.800",
        borderColor: "gray.600"
      }}
      {...rest}
    />
  );
}