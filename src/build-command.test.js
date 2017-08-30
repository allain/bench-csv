const build = require('./build-command')

describe('build-command', () => {
  it('works when empty', () => {
    expect(build({})).toBe('')
  })

  it('works when normal params', () => {
    expect(build({ _: ['a', 'b'] })).toBe('a b')
  })

  it('works for boolean params', () => {
    expect(build({ _: ['x'], a: true, b: false })).toBe('x --a --b=false')
  })
})
