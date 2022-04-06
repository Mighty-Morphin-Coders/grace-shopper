//Here I will include which technologies we used as well as who worked on this project

import React, { Component } from 'react';
import { motion } from 'framer-motion';
import Emoji from 'react-emoji-render';

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <motion.div
                    transition={{ ease: 'easeOut', duration: 1 }}
                    initial={{ opacity: 0 }}
                    animate={{ x: [-100, 0], opacity: 1 }}
                >
                    <h1>meet the team</h1>
                    <div id='team'>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: [0.9, 1.05] }}
                        >
                            <h1>
                                {' '}
                                <Emoji text=':woozy_face:' />
                            </h1>
                            <h2>Inderprit Singh</h2>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: [0.9, 1.05] }}
                        >
                            <h1>
                                <Emoji text=':smile:' />
                            </h1>
                            <h2>Felicia Heiney</h2>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: [0.9, 1.05] }}
                        >
                            <h1>
                                <Emoji text=':relaxed:' />
                            </h1>
                            <h2>Linda Laura</h2>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: [0.9, 1.05] }}
                        >
                            <h1>
                                <Emoji text=':smiling_imp:' />
                            </h1>
                            <h2>Arjan Mitra</h2>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    transition={{ ease: 'easeOut', duration: 1 }}
                    initial={{ opacity: 0 }}
                    animate={{ x: [100, 0], opacity: 1 }}
                >
                    <h1>meet the stack</h1>
                    <div id='technologies'>
                        <img
                            className='techPic'
                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbduhNrgkszKBJlQhwwD4H2o7pNiCgpsZeGQ&usqp=CAU'
                        />
                        <img
                            className='techPic'
                            src='https://miro.medium.com/max/365/1*Jr3NFSKTfQWRUyjblBSKeg.png'
                        />
                        <img
                            className='techPic'
                            src='https://upload.wikimedia.org/wikipedia/commons/4/49/Redux.png'
                        />
                        <img
                            className='techPic'
                            src='https://reactjsexample.com/content/images/2020/04/motion.png'
                        />
                        <img
                            className='techPic'
                            src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Oauth_logo.svg/598px-Oauth_logo.svg.png'
                        />
                        <img
                            className='techPic'
                            src='http://getpandaeats.com/stripe/assets/img/stripe.png'
                        />
                    </div>
                </motion.div>
            </div>
        );
    }
}

export default About;
