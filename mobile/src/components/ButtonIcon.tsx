import { FC } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { useTheme } from "native-base";
import { IconProps } from "phosphor-react-native";

interface Props extends TouchableOpacityProps {
  icon: FC<IconProps>;
}

export function ButtonIcon({ icon: Icon, ...rest }: Props) {
  const { colors, sizes } = useTheme();

  return (
    <TouchableOpacity {...rest}>
      <Icon color={colors.gray[300]} size={sizes[6]} />
    </TouchableOpacity>
  );
}