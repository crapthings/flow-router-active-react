import React from 'react'
import { mount } from 'react-mounter'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import { compose } from 'react-komposer'

window.FlowRouter = FlowRouter

const Nav = ({ route }) => {
  console.log(route)
  return <ul>
    <li>
      <a href='/' className={route.path === '/' ? 'active' : ''}>home</a>
    </li>

    <li>
      <a href='/about' className={route.path === '/about' ? 'active' : ''}>about</a>
    </li>
  </ul>
}

const ReactiveNav = compose(track(flowRouterCurrent))(Nav)

const Layout = ({ children }) => <div>
  <ReactiveNav />
  {children()}
</div>

const Home = () => <div>
  hello kitty
</div>

const About = () => <div>
  about kitty
</div>

FlowRouter.route('/', {
  action() {
    mount(Layout, {
      children: () => <Home />
    })
  }
})

FlowRouter.route('/about', {
  action() {
    mount(Layout, {
      children: () => <About />
    })
  }
})

function track(reactiveMapper) {
  return (props, onData, env) => {
    let trackerCleanup = null
    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        trackerCleanup = reactiveMapper(props, onData, env)
      })
    })

    return () => {
      if(typeof trackerCleanup === 'function') trackerCleanup()
      return handler.stop()
    }
  }
}

function flowRouterCurrent(props, onData) {
  route = FlowRouter.current()
  onData(null, { route })
}
