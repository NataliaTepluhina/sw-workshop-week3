import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'
import MyButton from '@/components/MyButton.vue'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: MyComponent,
  },
]

const router = new VueRouter({
  routes,
})

describe('MyComponent', () => {
  let wrapper

  function createComponent(props = {}, data = {}) {
    wrapper = shallowMount(MyComponent, {
      propsData: {
        ...props,
      },
      data() {
        return {
          ...data,
        }
      },
      localVue,
      router,
    })
  }

  const findTitle = () => wrapper.find("[data-testid='title']")
  const findCount = () => wrapper.find('.test-count')
  const findIncrementButton = () => wrapper.find('.test-increment-button')

  afterEach(() => {
    wrapper.destroy()
    wrapper = null
  })

  it('renders a Vue component', () => {
    createComponent()

    expect(wrapper.exists()).toBe(true)
  })

  it('does not render a title when showTitle prop is false', () => {
    createComponent()

    expect(findTitle().exists()).toBe(false)
  })

  it('renders a title when showTitle prop is true', () => {
    createComponent({ showTitle: true })

    expect(findTitle().exists()).toBe(true)
  })

  it('increments count on button click', async () => {
    createComponent()

    expect(findCount().text()).toContain('0')
    findIncrementButton().trigger('click')

    // return wrapper.vm.$nextTick().then(() => {
    //   expect(findCount().text()).toContain('1')
    // })

    await wrapper.vm.$nextTick

    expect(findCount().text()).toContain('1')
  })

  it('calculates a correct double value', () => {
    createComponent()

    expect(wrapper.find('.test-double').text()).toContain(0)
  })

  it('calculates a correct double value with initial count of 1', () => {
    createComponent({}, { count: 1 })

    expect(wrapper.find('.test-double').text()).toContain(2)
  })

  it.each`
    count   | double
    ${0}    | ${0}
    ${1}    | ${2}
    ${2}    | ${4}
    ${15}   | ${30}
    ${1000} | ${2000}
  `('calculates a correct double value for $count', ({ count, double }) => {
    createComponent({}, { count })

    expect(wrapper.find('.test-double').text()).toBe(`Count x2: ${double}`)
  })

  it('emits a custom event on emitter button click', () => {
    createComponent()

    wrapper.find('.test-emitter').trigger('click')
    expect(wrapper.emitted('custom-event')).toEqual([['Hello World']])
  })

  it('triggers a watcher on showTitle prop change', async () => {
    createComponent()

    wrapper.setProps({
      showTitle: true,
    })

    await wrapper.vm.$nextTick

    expect(wrapper.emitted('watcher-triggered')).toBeTruthy()
  })

  it('increments child counter on button component click', async () => {
    createComponent()

    expect(wrapper.findComponent(MyButton).props('double')).toBe(0)
    expect(wrapper.findComponent(MyButton).classes()).not.toContain('colored')

    wrapper.findComponent(MyButton).vm.$emit('click')
    await wrapper.vm.$nextTick
    expect(wrapper.find('.test-child-counter').text()).toContain(2)

    console.log(wrapper.html())
  })
})
