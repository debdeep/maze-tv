import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { i18n } from '../locales'

describe('App', () => {
  it('renders the shared header, navigation, and footer', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n],
        stubs: {
          RouterView: { template: '<div />' },
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    })

    expect(wrapper.text()).toContain('Maze TV')
    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('History')
  })
})
