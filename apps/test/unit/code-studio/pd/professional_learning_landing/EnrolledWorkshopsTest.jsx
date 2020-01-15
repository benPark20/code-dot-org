import React from 'react';
import {shallow} from 'enzyme';
import {EnrolledWorkshopsTable} from '@cdo/apps/code-studio/pd/professional_learning_landing/EnrolledWorkshops';
import sinon from 'sinon';
import {assert, expect} from 'chai';
import * as utils from '@cdo/apps/utils';

describe('EnrolledWorkshops', () => {
  const workshops = [
    {
      id: 1,
      sessions: [],
      location_name: 'My house',
      location_address: '123 Fake Street',
      on_map: false,
      funded: false,
      workshop_type: 'workshopType',
      course: 'course',
      subject: 'subject',
      enrolled_teacher_count: 10,
      capacity: 15,
      facilitators: [],
      organizer: {name: 'organizer_name', email: 'organizer_email'},
      enrollment_code: 'code1',
      state: 'Not Started',
      user_id: 123,
      attended: false
    },
    {
      id: 2,
      sessions: [],
      location_name: 'My house',
      location_address: '123 Fake Street',
      on_map: false,
      funded: false,
      workshop_type: 'workshopType',
      course: 'course',
      subject: 'subject',
      enrolled_teacher_count: 10,
      capacity: 15,
      facilitators: [],
      organizer: {name: 'organizer_name', email: 'organizer_email'},
      enrollment_code: 'code2',
      state: 'In Progress',
      user_id: 123,
      attended: false
    },
    {
      id: 3,
      sessions: [],
      location_name: 'My house',
      location_address: '123 Fake Street',
      on_map: false,
      funded: false,
      workshop_type: 'workshopType',
      course: 'course',
      subject: 'subject',
      enrolled_teacher_count: 10,
      capacity: 15,
      facilitators: [],
      organizer: {name: null, email: null},
      enrollment_code: 'code3',
      state: 'Ended',
      user_id: 123,
      attended: true
    },
    {
      id: 4,
      sessions: [],
      location_name: 'My house',
      location_address: '123 Fake Street',
      on_map: false,
      funded: false,
      workshop_type: 'workshopType',
      course: 'course',
      subject: 'subject',
      enrolled_teacher_count: 10,
      capacity: 15,
      facilitators: [],
      organizer: {name: null, email: null},
      enrollment_code: 'code4',
      state: 'Ended',
      user_id: 123,
      attended: false
    }
  ];

  beforeEach(() => {
    sinon.stub(utils, 'windowOpen');
  });

  afterEach(() => {
    utils.windowOpen.restore();
  });

  it('Clicking cancel enrollment cancels the enrollment', () => {
    const enrolledWorkshopsTable = shallow(
      <EnrolledWorkshopsTable workshops={workshops} />
    );

    // We expect there to be a table with 4 rows in the body, three of which have two buttons
    expect(enrolledWorkshopsTable.find('tbody tr')).to.have.length(4);
    expect(enrolledWorkshopsTable.find('tbody tr Button')).to.have.length(7);
    expect(enrolledWorkshopsTable.state('showCancelModal')).to.be.false;
    expect(enrolledWorkshopsTable.state('enrollmentCodeToCancel')).to.equal(
      undefined
    );

    // Pushing the button should bring up the modal
    enrolledWorkshopsTable
      .find('tbody tr Button')
      .first()
      .simulate('click');
    expect(enrolledWorkshopsTable.state('showCancelModal')).to.be.true;
    expect(enrolledWorkshopsTable.state('enrollmentCodeToCancel')).to.equal(
      'code1'
    );
  });

  it('Clicking "Print Certificate" opens the certificate in a new tab if user attended workshop', function() {
    const enrolledWorkshopsTable = shallow(
      <EnrolledWorkshopsTable workshops={workshops} />
    );

    // Click the "Print Certificate" button
    enrolledWorkshopsTable
      .find('tbody tr')
      .at(2)
      .find('Button')
      .first()
      .simulate('click');

    assert(utils.windowOpen.calledOnce);
    assert(
      utils.windowOpen.calledWith(
        `/pd/generate_workshop_certificate/${workshops[2].enrollment_code}`
      )
    );
  });

  it('Clicking "Print Certificate" does not open the certificate if user did not attend workshop', function() {
    const enrolledWorkshopsTable = shallow(
      <EnrolledWorkshopsTable workshops={workshops} />
    );

    // Click the "Print Certificate" button
    const printCertificateButton = enrolledWorkshopsTable
      .find('tbody tr')
      .at(3)
      .find('Button')
      .first();

    expect(printCertificateButton.prop('disabled')).to.be.true;
  });
});
