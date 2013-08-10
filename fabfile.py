from fabric.api import local, cd, env, run

env.hosts = ['u-shell.csc.kth.se']
env.user = 'purmonen'
env.password = 'Bc23De34'

def test():
    print('Checking that your app works. mmm... it did!')

def commit():
    local('git add -A && git commit')

def push():
    local('git push')

def prepare_deploy():
    test()
    commit()
    push()

def deploy():
    with cd('~/public_html/superettan'):
        run('git fetch --all')
        run('git reset --hard origin/master')

def update_and_deploy():
    prepare_deploy()
    deploy()
