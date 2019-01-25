
export default  class valid {
    agreeChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? !this.state.agree : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    phoneChange = (event) => {
        if (event.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                hasError: true,
            });
        } else {
            this.setState({
                hasError: false,
            });
        }
        this.setState({
            event,
        });
    }
    passwordChange = (event) => {
        if (event.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                hasError: true,
            });
        } else {
            this.setState({
                hasError: false,
            });
        }
        this.setState({
            event,
        });
    }
    yzmChange = (event) => {
        if (event.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                hasError: true,
            });
        } else {
            this.setState({
                hasError: false,
            });
        }
        this.setState({
            event,
        });
    }
    companyChange = (event) => {
        if (event.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({
                hasError: true,
            });
        } else {
            this.setState({
                hasError: false,
            });
        }
        this.setState({
            event,
        });
    }
}