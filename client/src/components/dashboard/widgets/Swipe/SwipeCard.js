import React from 'react';
import { animated } from 'react-spring';

import { string, number } from 'prop-types';

function SwipeCard({ index, x, y, scale, bind, student })
{
    // Pull out the relevant information inside student
    const { name, major, gradYear, bio, photo } = student;

    return (
        // Card contents
        <animated.div {...bind(index)} key={index} style={{ x: x, y: y, scale: scale, position: 'absolute' }}>
            <div className='card'>
                <img src={photo} key={index} alt='' />
                <h2>{name}</h2>
                <h2>{gradYear}</h2>
                <h5>{major}</h5>
                <h5>{bio}</h5>
            </div>
        </animated.div>
    )
}

SwipeCard.propTypes = 
{
    name: string,
    major: string,
    gradYear: number,
    bio: string,
    photo: string,
}

export default SwipeCard;