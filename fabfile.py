from fabric.api import local

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


