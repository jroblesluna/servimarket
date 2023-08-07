import React from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';

const getShadowOffset = (type, offset) => {
  switch (type) {
    case ['top', 'bottom'].includes(type):
      return {
        width: 0,
        height: offset,
      };
    case ['left', 'right'].includes(type):
      return {
        width: offset,
        height: 0,
      };
    default:
      return {
        width: 0,
        height: 0,
      };
  }
};

const Shadow = ({
  type,
  shadowColor,
  shadowOpacity,
  shadowOffset,
  shadowRadius,
  elevation,
}) => {
  const shadowStyle = {
    shadowColor: shadowColor,
    shadowOffset: getShadowOffset(type, shadowOffset),
    shadowRadius: shadowRadius,
    shadowOpacity: shadowOpacity,
    elevation: elevation,
  };
  return <View style={[styles.shadow, styles[type], shadowStyle]} />;
};

const shadowTypes = ['left', 'top', 'right', 'bottom'];

const Shadows = props => {
  return shadowTypes.map((shadow, i) => {
    if (!props[shadow]) {
      return null;
    }
    const {shadowColor, shadowOpacity, shadowOffset, shadowRadius, elevation} =
      props;
    const shadowProps = {
      shadowColor,
      shadowOpacity,
      shadowOffset,
      shadowRadius,
      elevation,
    };
    return <Shadow key={`shadow-${i}`} type={shadow} {...shadowProps} />;
  });
};

// default to show all edges
Shadows.defaultProps = {
  left: true,
  top: true,
  right: true,
  bottom: true,
};

const InsetShadow = ({
  children,
  containerStyle,
  left,
  top,
  right,
  bottom,
  shadowColor,
  shadowRadius,
  shadowOffset,
  shadowOpacity,
  elevation,
}) => {
  const shadowProps = {
    left,
    top,
    right,
    bottom,
    shadowColor,
    shadowRadius,
    shadowOffset,
    shadowOpacity,
    elevation,
  };
  return (
    <View style={[styles.container, containerStyle]}>
      {children}
      <Shadows {...shadowProps} />
    </View>
  );
};

InsetShadow.propTypes = {
  children: PropTypes.node.isRequired,
  /* (default: {}) add style to the wrapper */
  containerStyle: PropTypes.object,
  /* (default: true) show the left shadow? */
  left: PropTypes.bool,
  /* (default: true) show the top shadow? */
  top: PropTypes.bool,
  /* (default: true) show the right shadow? */
  right: PropTypes.bool,
  /* (default: true) show the bottom shadow? */
  bottom: PropTypes.bool,
  /* (default: black) shadow color */
  shadowColor: PropTypes.string,
  /* (default: 3) shadow radius */
  shadowRadius: PropTypes.number,
  /* (default: 1) shadow offset - height for top, bottom, width for left, right */
  shadowOffset: PropTypes.number,
  /* (default 0.5) shadow opacity */
  shadowOpacity: PropTypes.number,
  /* (default: 5) shadow elevation for android */
  elevation: PropTypes.number,
};

InsetShadow.defaultProps = {
  containerStyle: {},
  left: true,
  top: true,
  right: true,
  bottom: true,
  shadowColor: 'black',
  shadowRadius: 3,
  shadowOffset: 5,
  shadowOpacity: 0.5,
  elevation: 5,
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: '100%',
  },
  shadow: {
    position: 'absolute',
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  left: {
    width: 10,
    height: '100%',
    left: -10,
  },
  top: {
    height: 10,
    width: '100%',
    top: -10,
  },
  right: {
    width: 10,
    height: '100%',
    right: -10,
  },
  bottom: {
    height: 10,
    width: '100%',
    bottom: -10,
  },
});

export default InsetShadow;
