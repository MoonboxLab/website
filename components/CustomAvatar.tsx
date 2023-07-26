import {
  AvatarComponent,
} from '@rainbow-me/rainbowkit';

const CustomAvatar: AvatarComponent = ({ ensImage, size }) => {
  return <img
    src={ensImage ? ensImage : '/alien_avatar.png'}
    width={size}
    height={size}
    style={{ borderRadius: 999 }}
  />

};

export default CustomAvatar