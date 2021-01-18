import React, { useState } from 'react';
import { useSprings } from 'react-spring';
import { useGesture } from 'react-use-gesture';

import SwipeCard from './SwipeCard.js';

import './Deck.css';

// Define the function that calculates the final position
const to = (index) =>
({
    // The card should be centered
    x: 0,
    // The card should have a vertical stacking visual
    y: index * -10,
    // The card should have the original scale
    scale: 1,
    // The card should load one by one instead of all at once
    delay: index * 100,
});

// Define the initial position of cards
const from = (index) =>
({
    // The card should be from high above
    y: -1000,
    // The card should be larger so it appears closer
    scale: 1.5,
});

// Define the function handle for api call for liking/unliking
const likeOrUnlike = (userId, student, status) =>
{
    console.log('The status is: ' + status);
}

// Define the function handle for requesting new stack of student info
const reload = () => 
{
    console.log('Reloading the stack');
}

// Student Info contains all the students that are not in the buddy list
// nor in the unlike list, when the deck is empty, the function will
// make an api call to server to update the Student Info passed into here
// so the deck will refresh
function SwipeDeck({ studentInfo, userId })
{
    // Define a stack for the swiped cards
    const [swiped] = useState(() => new Set());

    // Define the springs for dynamic effects
    const [props, setProps] = useSprings(studentInfo.length, (index) => ({...to(index), from: from(index)}));

    // Bind the detector to trace user actions
    const bind = useGesture(
    ({ args: [index], down, delta: [xDelta, yDelta], direction: [xDir], velocity}) => 
    {
        // Determine whether current action corresponds to like or unlike
        // With 1 being like, 0 being nothing, -1 being unlike
        const dir = xDir > 0 ? 1 : -1;
        const status = velocity <= 0.2 ? 0 : dir;

        // If the current action is something, add the current card to swiped
        // And make api call to add the student that the card represent
        if (!down && (status !== 0))
        {
            swiped.add(index);
            likeOrUnlike(userId, studentInfo[index], status);
        }

        // Set the target transition based on the user gesture
        setProps((item) => 
        {
            // If the item passed in is not the current card, return
            if (item !== index)
            {
                return;
            }

            // Determine whether the card has already been swiped
            const isSwiped = swiped.has(index);

            // Set the x and y position of the card,
            // If card is in the swiped set, make it outside the frame
            // Otherwise the card will follow the user's mouse
            const x = isSwiped ? (200 + window.innerWidth) * dir : (down ? xDelta : 0);
            const y = down ? yDelta : 0;

            // Set the scale
            const scale = down ? 1.1 : 1;

            return { x: x, y: y, scale: scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isSwiped ? 200 : 500 }};
        });

        // If the stack is card stack is empty, make api call to request new stack
        if (swiped.length === studentInfo.length)
        {
            reload();
        }
    });

    return props.map(({ x, y, scale }, index) =>
    (
        <SwipeCard key={index} index={index} x={x} y={y} scale={scale} student={studentInfo[index]} bind={bind}/>
    ))
};

export default SwipeDeck;