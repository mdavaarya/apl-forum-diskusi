import PropTypes from 'prop-types';

function Avatar({ src, name, size = 32 }) {
  const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '?')}&background=2b3a55&color=fff`;

  return (
    <img
      className="avatar"
      src={src || fallbackSrc}
      alt={name}
      width={size}
      height={size}
      onError={(event) => {
        const imgElement = event.currentTarget;
        imgElement.onerror = null;
        imgElement.src = fallbackSrc;
      }}
    />
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
};

Avatar.defaultProps = {
  src: '',
  name: 'Pengguna',
  size: 32,
};

export default Avatar;
