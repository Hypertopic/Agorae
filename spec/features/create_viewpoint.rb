require 'spec_helper'

feature 'Create a viewpoint' do

  given(:viewpoint_name) { a_string }

  scenario 'a private one' do
    visit $home_page
    click_on 'Log in'
    log_in_as 'alice', 'lapinblanc'
    toggle_edit
    click_plus_sign_next_to 'viewpoint'
    click_last 'viewpoint'
    type viewpoint_name, :return
    expect(page).to have_content(viewpoint_name)
  end

end
