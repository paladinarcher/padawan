# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |config|
  config.vbguest.iso_path = "D:/Programs/Oracle/VirtualBox/VBoxGuestAdditions.iso"
  config.vm.define "padawan", primary: true do |machine|
    machine.vm.box = "centos/7"
    machine.vm.box_version = "1811.02"
    machine.vm.hostname = "padawan"

    machine.vm.provider "virtualbox" do |vb, override|
      vb.memory = "8192"
      vb.cpus = "2"
      vb.gui = true
      machine.vm.synced_folder ".", "/u01/padawan", owner: "vagrant", group: "vagrant"
    end
#    machine.vm.provider "hyperv" do |hp, override|
#      hp.memory = "8192"
#      hp.cpus = "2"
#      machine.vm.synced_folder ".", "/u01/padawan", owner: "vagrant", group: "vagrant"
      ####problem - as it comes up it asks for username/password
#    end

    machine.vm.provision :docker
    machine.vm.provision :docker_compose, yml: "/u01/padawan/docker/vagrant/docker-compose.yml", run: "always"
  end
    config.vm.network "forwarded_port", guest: 3000, host: 3000, host_ip: "127.0.0.1"
end
