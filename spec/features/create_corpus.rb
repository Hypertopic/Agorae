require 'spec_helper'

feature 'Corpus' do

    $corpus = a_string()
    $user = 'alice'
    $pass = 'lapinblanc'

    scenario 'do create' do
        visit '/'
        click_on 'Se connecter'
        log_in_as $user, $pass
        toggle_edit
        click_plus_sign_next_to 'corpus'
        click_last 'corpus'
        type $corpus, :return
        expect(page).to have_content($corpus)
        toggle_edit
    end

    scenario 'do delete' do
        visit '/'
        click_on 'Se connecter'
        log_in_as $user, $pass
        toggle_edit
        click_del_sign_before $corpus, 'corpus'
        expect(page).to have_content($corpus)
        toggle_edit
    end

end