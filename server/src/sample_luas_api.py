from base_api import BaseAPI


class LuasAPI(BaseAPI):
    def __init__(self):
        super().__init__()

    def get(self):
        return "LuasAPI"


def main():
    x = LuasAPI()
    x.get()


if __name__ == '__main__':
    main()
