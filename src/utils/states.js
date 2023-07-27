export const dataInitialState = {
  selectedOffice: null,
  officeInfo: {
    name: "",
    address: "",
  },
  employeeInfo: {
    identification: null,
    name: "",
    office: "",
    services: [],
  },
  serviceInfo: {
    name: "",
    office: "",
    isFather: true,
    father: "",
    initial: "",
  },
  ticketInfo: {
    office: "",
    service: "",
  },
  activeEmployeeInfo: {
    state: "waiting",
    identification: null,
    name: "",
    office: "",
    services: [],
  },
}