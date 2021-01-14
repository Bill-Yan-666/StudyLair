import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import classnames from 'classnames';

import { login_user } from '../../actions/userActions.js';

class Login extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { email: '', password: '', errors: {}, authenticated: false };
    }

    static getDerivedStateFromProps(nextProps, currentState)
    {
        if (nextProps.auth.isAuthenticated) 
        {
            return { authenticated: true };
        }
        else if (nextProps.errors)
        {
            return { ...currentState, errors: nextProps.errors };
        }
        else
        {
            return null;
        }
    }

    onChange = (event) => 
    {
        this.setState({ ...this.state, [event.target.id]: event.target.value });
    };

    onSubmit = (event) =>
    {
        event.preventDefault();

        const userData = { email: this.state.email, password: this.state.password};

        this.props.login_user(userData);
    }

    render()
    {   
        const { errors } = this.state;

        return (this.state.authenticated ? <Redirect to='/studentDashboard' /> :
            <div className='container row' style={{ marginTop: '4rem' }}>
                {/* Link to home page */}
                <div className='col s8 offset-s2'>
                    <Link to='/' className='btn-falt waves-effect'>
                        <i className='material-icons left'>keyboard_backspace</i>Back to home
                    </Link>
                </div>
                

                {/* Link to regiser */}
                <div className="col s8 offset-s2" style={{ paddingLeft: "11.250px" }}>
                    <h4><b>Login</b> below</h4>
                    <p className="grey-text text-darken-1">
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </div>

                {/* Login form */}
                <form className="col s8 offset-s2" noValidate onSubmit={this.onSubmit}>
                    <div className='input-field col s12'>
                        <input className={classnames('',{ invalid: errors.email || errors.emailnotfound })} id='email' 
                            type='email' value={this.state.email} error={errors.email} onChange={this.onChange}></input>
                        <label htmlFor='email'>Email</label>
                        <span className='red-text'>{errors.email}{errors.emailnotfound}</span>
                    </div>
                    
                    <div className='input-field col s12'>
                        <input className={classnames('',{ invalid: errors.password || errors.passwordincorrect })} id='password' 
                            type='password' value={this.state.password} error={errors.password} onChange={this.onChange}></input>
                        <label htmlFor='email'>Email</label>
                        <span className='red-text'>{errors.password}{errors.passwordincorrect}</span>
                    </div>

                    <div className='col s12'>
                        <button className="btn-large waves-effect waves-light hoverable blue accent-3" type='submit' 
                                style={{ width: '150px', borderRadius: '3px', letterSpacing: '1.5px', marginTop: '1rem' }}>
                            Login
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

Login.propTypes = 
{
    login_user: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
}

function mapStateToProps(state)
{
    return (
    {
        auth: state.auth,
        errors: state.errors,
    });
}

export default connect(mapStateToProps, { login_user, })(Login);